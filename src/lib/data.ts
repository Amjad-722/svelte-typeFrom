import { CHOICES } from "./constant"
import type { Form } from "./types"

export const formA: Form = {
  title: "Auto Insurance Quote",
  caption: "Get a quote",
  description: "Find and compare auto insurance policies",
  fields: [
    {
      id: "reason",
      type: "short_text",
      title: "Why are you looking for auto insurance?",
    },
    {
      id: "zip_code",
      type: "zip_code",
      title: "What is your zip code?",
      required: true,
    },
    {
      id: "car_brand",
      type: "choice",
      title: "What brand of car do you drive?",
      choices: CHOICES.carBrands,
    },
    {
      id: "miles_per_month",
      type: "choice",
      title: "How many miles do you typically drive per year?",
      choices: CHOICES.annualMileage,
    },
    {
      id: "accidents",
      type: "choice",
      title: "Have you been involved in any at-fault car accidents in the past 3 years?",
      required: true,
      choices: [
        { id: "yes", label: "Yes, 1 accident" },
        { id: "no", label: "No" },
      ],
    },
    {
      id: "insurance",
      type: "choice",
      title: "Have you had auto insurance in the past 30 days?",
      choices: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
      ],
    },
    {
      id: "drivers",
      type: "number",
      title: "How many drivers will be on the policy?",
    },
    {
      id: "notes",
      type: "short_text",
      title: "Is there anything else we should consider?",
    },
  ],
}

export const formB: Form = {
  title: "Personal Information",
  caption: "Tell us about yourself",
  description: "We need some basic information to provide you with accurate quotes",
  fields: [
    {
      id: "zip_code",
      type: "zip_code",
      title: "What is your zip code?",
      required: true,
    },
    {
      id: "birth_date",
      type: "date",
      title: "When were you born?",
      required: true,
    },
    {
      id: "age",
      type: "number",
      title: "What is your age?",
      required: true,
    },
    {
      id: "credit_score",
      type: "choice",
      title: "What is your credit score?",
      choices: CHOICES.creditScore,
    },
    {
      id: "email",
      type: "email",
      title: "Which email address can we use to contact you?",
      required: true,
    },
  ],
}
