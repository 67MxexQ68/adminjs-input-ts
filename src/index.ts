import Express from "express";
import bodyParser from "body-parser";
import express from 'express';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import { model, Schema, Types } from 'mongoose';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSMongoose from '@adminjs/mongoose';
import { componentLoader, Components } from './components'

/* ------------------------------------ Use Global Variables ------------------------------- */

global.Config = { Foo: "Bar" };
global.Foo = "Bar";

/* ------------------------------------ Set up Mongoose ------------------------------------ */
const app = Express();
mongoose.connect("mongodb+srv://itemadmin:mJUAhuf7j9VXkiq6@item-input-db.dhrfvdq.mongodb.net/?retryWrites=true&w=majority");

interface IUser {
    email: string;
    encryptedPassword: string;
    role: string;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true
    },
    encryptedPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'restricted'],
        required: true
    }
});

const User = model<IUser>('User', userSchema);


interface IItem {
    name: string;
    title: string;
    description: string;
    category: string;
    lbh: string;
    amount: string;
    image: string;
    checklist: boolean;
}

const itemSchema = new Schema<IItem>({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    lbh: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    checklist: {
        type: Boolean,
        required: false
    }
});

const Item = model<IItem>('Item', itemSchema);


/* ------------------------------------ Set up AdminJS ------------------------------------ */
AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
});

const admin = new AdminJS({
    databases: [mongoose],
    resources: [{
        resource: User,
        options: {
            properties: {
                encryptedPassword: {
                    isVisible: false,
                },
                password: {
                    type: 'string',
                    isVisible: {
                        list: false, edit: true, filter: false, show: false,
                    },
                },
            },
            actions: {
                new: {
                    before: async (request) => {
                        if (request.payload.password) {
                            request.payload = {
                                ...request.payload,
                                encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                                password: undefined,
                            }
                        }
                        return request
                    },
                    isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                },
                edit: {
                    isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                },
                delete: {
                    isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                },
                list: {
                    isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                },
            }
        }
    },
    {
        resource: Item,
        options: {
            actions: {
                edit: {
                    isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                },
                delete: {
                    isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                },
            },
            properties: {
                image: {
                    components: {
                        //edit: AdminJS.bundle("/workspaces/item-input-admin/my-edit.tsx"), // this is our custom component
                        edit: Components.MyInput, // this is our custom component
                        list: Components.MyImgView, // this is our custom component
                        show: Components.MyImgView, // this is our custom component
                    },
                },
            },
        }
    }],
    rootPath: '/admin',
    branding: {
        companyName: 'Item Input Dashboard',
    },
    componentLoader,
});

// Build and use a router which will handle all AdminJS routes
//const adminRouter = AdminJSExpress.buildRouter(admin);
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
    authenticate: async (email, password) => {
        const user = await User.findOne({ email });
        if (user) {
            console.log(user.email);
            var mat;
            const matched = bcrypt.compareSync(password, user.encryptedPassword); /*, (err, res) => {
          if(err) {
              console.log('Comparison error: ', err);
          } 
          if(res) {
            mat = true;
            return user;
        }
      }
      );*/
            console.log(matched);
            console.log(mat);
            if (matched) {
                return user
            }
        }
        return false
    },
    cookiePassword: 'some-secret-password-used-to-secure-cookie', // TODO: change cookiePassword
});
// app.use(admin.options.rootPath, adminRouter);
app.use(admin.options.rootPath, adminRouter);

//app.use(bodyParser.json())

/* ------------------------------------ Set up Express ------------------------------------ */
app.get('/ping', function (req: Express.Request, res: Express.Response) {
    console.log(`${new Date().toISOString()}: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    // req.UserID is available here because of the modification of the global namespace
    res.json({ Pong: new Date() });
});
const port = process.env.PORT || 3000
app.listen(port, function () {
    console.log("Server is up and running on port "+port+".");
});

export {

};