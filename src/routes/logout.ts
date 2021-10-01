import type { RequestHandler } from "@sveltejs/kit"

export const get: RequestHandler = (req) => {
  req.locals.user = null
  req.locals.token = null
  return {
    status: 302,
    headers: {
      location: '/',
      "set-cookie":[
        `access_token=`,
        `refresh_token=`
      ]
    }
  }
}