import { Alert } from "@nice-digital/nds-alert";

export const ResetPasswordSuccess = () => {
  // setTimeout(() => (document.location = '/login'), 5000)
  return (
    <div>
      <h2>Thank you</h2>
      <Alert type="success">
        Your password has been changed.
      </Alert>
    </div>
  )
}
