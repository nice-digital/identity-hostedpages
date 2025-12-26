import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
//import { Promise } from "es6-promise";

import "./init";
import { App } from "./components/App/App";
import { isLoginPage } from "./helpers";

import "@nice-digital/design-system/scss/base.scss";

global.Promise = global.Promise || Promise;
global.__DEV__ =	global.__DEV__ || document.location.host.indexOf("localhost") > -1;

const basename = isLoginPage ? "" : "/lo/reset";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter basename={basename}>
			<App />
		</BrowserRouter>
	</StrictMode>
);
