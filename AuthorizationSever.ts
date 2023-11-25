import express, { Express, Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import authorRoute from './src/routes/AuthorizationRoute'

class AuthorizationSever {
    private app: Express
    private port

    constructor() {
        this.app = express()
        this.port = process.env.PORT_AUTH || 8081
        this.configurationSever()
    }

    private configurationSever() {
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))

        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Headers', 'X-Requested-With')
            res.header('Access-Control-Allow-Headers', 'Content-Type')
            res.header(
                'Access-Control-Allow-Methods',
                'PUT, GET, POST, DELETE, OPTIONS',
            )
            next()
        })

        this.app.use('/api', authorRoute.router)
    }

    public startSever() {
        this.app.listen(this.port, () => {
            console.log(
                `⚡️[server]: Authorization server is running at http://localhost:${this.port}`,
            )
        })
    }
}

export default new AuthorizationSever()
