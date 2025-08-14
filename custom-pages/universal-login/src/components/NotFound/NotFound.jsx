import { createBrowserHistory } from "history";

const goBack = (e) => {
  e.preventDefault()
  return createBrowserHistory.goBack();
}

export const NotFound = () => (
  <>
    <h4>Something must have gone slightly wrong!</h4>
    <p><a href="/" onClick={goBack}>&larr; Back</a></p>
  </>
);
