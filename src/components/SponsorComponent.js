import React from "react";
import { makeStyles } from "@material-ui/styles";

import Button from "react-bootstrap/Button";

import clsx from "clsx";

const useStyles = makeStyles({
  BuyMeCoffee: {
    fontSize: "12px !important",
  },
});

function SponsorComponent() {
  const classes = useStyles();

  return (
    <div className="pl-3 pr-3 pt-2">
      <Button
        href="https://www.buymeacoffee.com/jooojub"
        target="_blank"
        className={clsx("p-3", classes.BuyMeCoffee)}
        variant="dark"
        size="sm"
        alt="Buy me a coffee!!"
      >
        <i class="fas fa-mug-hot" />
        &nbsp;&nbsp;&nbsp;Buy me a coffee
      </Button>
    </div>
  );
}

export default SponsorComponent;
