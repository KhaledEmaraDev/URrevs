import React, { useMemo } from "react";
import PropTypes from "prop-types";
import CallToAction from "../components/CallToAction";
import Carousel from "../components/Carousel";
import Grid from "@material-ui/core/Grid";
import ProductReviews from "../components/ProductReviews";

import { useStateValue } from "../store";
import { fillForm, setDialog } from "../actions";

const upcomingSlides = [
  {
    brand: "Xiaomi",
    product: "Mi 9T"
  },
  {
    brand: "Huawei",
    product: "HONOR 20 lite"
  }
];

const popularSlides = [
  {
    brand: "Xiaomi",
    product: "Redmi Note 7"
  },
  {
    brand: "Xiaomi",
    product: "POCO F1"
  },
  {
    brand: "Samsung",
    product: "Galaxy A50"
  },
  {
    brand: "Huawei",
    product: "P30 lite"
  },
  {
    brand: "Oppo",
    product: "Realme 3 Pro"
  },
  {
    brand: "Huawei",
    product: "Honor 8X"
  }
];

function MainCallToAction() {
  const [{ user }, dispatch] = useStateValue();

  return useMemo(() => {
    function handleReviewClick() {
      dispatch(fillForm("review", "brand", null));
      dispatch(fillForm("review", "product", null));
      dispatch(setDialog("review"));
    }

    function handleSignUpClick() {
      dispatch(setDialog("sign-up"));
    }

    return (
      <CallToAction
        headerTitle="أول منصة لمراجعات المستخدمين بالشرق الأوسط"
        subheaderTitle="اَراء مستخدمي الهواتف في مكان واحد"
        subtitle="هدفنا مساعدتك تختار"
        primaryActionText="راجع الاَن"
        handlePrimaryAction={handleReviewClick}
        showSecondaryAction={!user}
        secondaryActionText="سجل الاَن"
        handleSecondaryAction={handleSignUpClick}
      />
    );
  }, [dispatch, user]);
}

export default function Index(props) {
  const { reviews } = props;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <MainCallToAction />
      </Grid>
      <Grid item xs={12}>
        <ProductReviews title="أخر المراجعات" reviews={reviews} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Carousel title="أحدث الهواتف" slides={upcomingSlides} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Carousel title="أشهر الهواتف" slides={popularSlides} />
      </Grid>
    </Grid>
  );
}

Index.getInitialProps = async () => {
  const res = await fetch(`http://localhost:3000/api/review/most_recent`);
  const result = await res.json();
  return {
    reviews: result.reviews
  };
};

Index.propTypes = {
  reviews: PropTypes.array
};
