import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import "@fontsource/public-sans";
import { CssVarsProvider } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Slider from "@mui/joy/Slider";
import Stack from "@mui/joy/Stack";
import Table from "@mui/joy/Table";
import { useState } from "react";

const marks = [
  {
    value: 580,
    label: "Fair",
    rate: 7.1,
  },
  {
    value: 670,
    label: "Good",
    rate: 6.5,
  },
  {
    value: 740,
    label: "Very Good",
    rate: 6.0,
  },
  {
    value: 800,
    label: "Excellent",
    rate: 5.5,
  },
];

function interestRate(creditScore) {
  const bestLevel = marks.findIndex((level) => creditScore < level.value);
  let rate;
  if (bestLevel == 0) {
    rate = 10.0; // Default interest rate for credit below fair
  } else {
    if (bestLevel > 0) {
      rate = marks[bestLevel - 1].rate;
    } else {
      rate = marks[marks.length - 1].rate;
    }
  }
  return rate;
}

function valueText(value) {
  return `${value}`;
}

function calculatePayment(loanAmount, interestRatePercent, durationMonths) {
  const monthlyInterestRate = interestRatePercent / 100 / 12;
  const paymentPerUnit =
    monthlyInterestRate / (1 - (1 + monthlyInterestRate) ** -durationMonths);
  const payment = loanAmount * paymentPerUnit;
  const paymentString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(payment);
  return paymentString;
}

export default function Home() {
  const initialLoanAmount = 15000;
  const defaultCreditScore = 600;
  const loanTermMonths = [36, 48, 60, 72, 84];

  const [loanAmount, setLoanAmount] = useState(initialLoanAmount);
  const [creditScore, setCreditScore] = useState(defaultCreditScore);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <CssVarsProvider>
          <Sheet
            sx={{
              width: 800,
              height: 500,
              mx: "auto", // margin left & right
              my: 4, // margin top & bottom
              py: 3, // padding top & bottom
              px: 2, // padding left & right
              display: "flex",
              flexDirection: "column",
              gap: 2,
              borderRadius: "sm",
              boxShadow: "md",
            }}
          >
            <FormControl>
              <FormLabel>Loan amount</FormLabel>
              <Input
                // html input attribute
                name="amount"
                type="number"
                placeholder={initialLoanAmount.toString()}
                onChange={(event) => setLoanAmount(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Credit score</FormLabel>
              <Slider
                aria-label="Always visible"
                min={300}
                max={850}
                step={10}
                defaultValue={defaultCreditScore}
                getAriaValueText={valueText}
                marks={marks}
                valueLabelDisplay="auto"
                //sx={{ mx: 10 }}
                onChange={(event) => setCreditScore(event.target.value)}
              />
            </FormControl>

            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Table
                aria-label="payment table"
                variant="outlined"
                stripe="odd"
                sx={{
                  width: "50%",
                  "& tr > *:not(:first-of-type)": { textAlign: "right" },
                }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>Months</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {loanTermMonths.map((months) => (
                    <tr key={months}>
                      <td>{months}</td>
                      <td>
                        {calculatePayment(
                          loanAmount,
                          interestRate(creditScore),
                          months
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Stack>
          </Sheet>
        </CssVarsProvider>
      </main>
    </>
  );
}
