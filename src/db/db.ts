import { db_connect } from "./controllers/db.controller"
import { user_controller as uc } from "./controllers/user.controller"
import { logsEvent_controller as lc } from "./controllers/logsEvent.controller"
import { marker_controller as mc } from "./controllers/marker.controller"

export const db = new db_connect()

export const user_controller = new uc(db)
export const logsEvent_controller = new lc(db)
export const marker_controller = new mc(db)


