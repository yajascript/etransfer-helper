https://etransfer-helper.vercel.app/

- [ ] link invoice
- [ ] cant CMD A to select all  

- [ ] support/donate icon on both pages https://donate.stripe.com/fZu5kCbeB8vW82I8RcfAc02

    # TASK: Integrate Branded Stripe Donation Link into E-Transfer Helper UI

    ## 1. Objective
    Add a clean, minimalist "Support Project / Buy me a Coffee" donation trigger to the E-Transfer Helper app that opens a customized Stripe Payment Link. The component must seamlessly match the existing dark navy and vibrant teal UI theme.

    ---

    ## 2. Design Tokens & Styling
    - **Primary Accent / Button Fill:** Teal `#2DD4BF` (Hover: `#26beac`)
    - **Secondary / Card Background:** `#16233B` / `bg-slate-900/60` with `border border-slate-700/50`
    - **Text Color:** Slate Muted `#94A3B8` (Hover: `#FFFFFF`)
    - **Radius:** `rounded-full` for footer pill or `rounded-xl` for card actions
    - **Icons:** Lucide React icons (`Coffee`, `ExternalLink`)


    <script async
      src="https://js.stripe.com/v3/buy-button.js">
    </script>

    <stripe-buy-button
      buy-button-id="buy_btn_1U4SfwAI7hUZFjXc6cTEbTwg"
      publishable-key="pk_live_51TWIiKAI7hUZFjXcGA0X5vKMHkwXh1jhaeJgngkXWB4tiqzRX70eCpqmrVhP4DE0zzndy20ttoRwldG3o0Go3jJ5003WiJumqz"
    >
    </stripe-buy-button>