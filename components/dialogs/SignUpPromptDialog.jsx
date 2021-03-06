import React from "react";
import fetch from "../../fetch";
import Avatar from "@material-ui/core/Avatar";
import Button from "../Button";
import Container from "@material-ui/core/Container";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";

import { useStateValue } from "../../store";
import { setDialog, showSnackbar } from "../../actions";

import * as gtag from "../../lib/gtag";

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(2, 0, 2, 0),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(4)
  }
}));

export default function SignUpPromptDialog() {
  const classes = useStyles();
  const [
    {
      forms: { review }
    },
    dispatch
  ] = useStateValue();

  function handleSignUp() {
    dispatch(setDialog("sign-up"));
  }

  function handleReviewAnonymously() {
    const {
      brand,
      product,
      date_buy,
      rating,
      pros,
      cons,
      ratings,
      brand_rating,
      brand_pros,
      brand_cons
    } = review;

    gtag.event({
      action: "submit_form",
      category: "review",
      label: `${brand} ${product}`
    });

    fetch("/api/review", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({
        review: {
          brand,
          product,
          date_buy,
          rating,
          pros,
          cons,
          ratings,
          brand_rating,
          brand_pros,
          brand_cons
        }
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("حدث خطأ في الاتصال");
        return res.json();
      })
      .then(result => {
        dispatch(setDialog(null));
        dispatch(
          showSnackbar(result.status ? "success" : "error", result.message)
        );
      })
      .catch(err => {
        dispatch(setDialog(null));
        dispatch(showSnackbar("error", err.message));
      });
  }

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          هل تريد تسجيل حساب؟
        </Typography>
        <div className={classes.form}>
          <Typography variant="body1">
            تسجيل حساب سيعطيك صلاحيات تعديل المراجعة فيما بعد بالإضافة لزيادة
            الثقة في مراجعتك
          </Typography>
          <Button fullWidth color="red" onClick={handleSignUp}>
            سجل الاَن
          </Button>
          <Button fullWidth color="blue" onClick={handleReviewAnonymously}>
            انشر كمجهول
          </Button>
        </div>
      </div>
    </Container>
  );
}
