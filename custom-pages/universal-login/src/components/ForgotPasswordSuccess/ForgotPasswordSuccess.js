import React from 'react'
import { Link } from 'react-router-dom'
import { Grid, GridItem } from "@nice-digital/nds-grid";
import styles from './ForgotPasswordSuccess.module.scss'

const ForgotPasswordSuccess = () => {
  return (
    <div>
      <h3>Thank you</h3>
      <p className="lead" data-qa-sel="forgotPasswordSuccess-message1">
        We have sent you an email with a link to help you reset your password. It might take a few minutes to come through, but if you don't receive it please check your spam folder.
      </p>
      <p className="lead" data-qa-sel="forgotPasswordSuccess-message2">If you have problems resetting your password, contact us.</p>
      <Grid>
				<GridItem cols={12} md={9}>
          <div className={`${styles.summaryList} pv--c`}>
            <span className={styles.summaryListLabel}>
              Email
            </span>
            <span className={styles.summaryListDetail}>
              nice@nice.org.uk
            </span>
          </div>

          <div className={`${styles.summaryList} pv--c mb--d`}>
            <span className={styles.summaryListLabel}>
              Telephone
            </span>
            <span className={styles.summaryListDetail}>
              +44(0)300 323 0140
            </span>
          </div>
        </GridItem>
      </Grid>
      
      <Link data-qa-sel="forgotPasswordSuccess-link-to-login" to="/">Return to sign in</Link>
    </div>
  )
}

export default ForgotPasswordSuccess