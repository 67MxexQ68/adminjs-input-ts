import Express from "express";
import bcrypt from 'bcrypt';
//import react from 'React'
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
mongoose.connect("mongodb+srv://barnybarny:6R57AWuiFkFOud94@cluster0.ypzzozv.mongodb.net/?retryWrites=true&w=majority");

/* mongodb+srv://itemadmin:mJUAhuf7j9VXkiq6@item-input-db.dhrfvdq.mongodb.net/?retryWrites=true&w=majority mongodb+srv://barnybarny:6R57AWuiFkFOud94@cluster0.ypzzozv.mongodb.net/?retryWrites=true&w=majority */

interface IUser {
    email: string;
    encryptedPassword: string;
    role: string;
    group: string;
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
    },
    group: {
        type: String,
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
    group: string;
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
    },
    group: {
        type: String,
        required: true
    },
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
                list: {
                    before: async (request, context) => {
                        const { currentAdmin } = context
                        if (currentAdmin.role === 'admin') {
                            return request
                        }
                        return {
                            ...request,
                            query: {
                                ...request.query,
                                'filters.group': currentAdmin.group
                            }
                        }
                    },
                },
                edit: {
                    before: async (request, context) => {
                        const { currentAdmin } = context
                        request.payload = {
                            ...request.payload,
                            group: currentAdmin.group
                        }
                        console.log(request.payload.group)
                        return request
                    },
                    isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                },
                new: {
                    before: async (request, context) => {
                        const { currentAdmin } = context
                        request.payload = {
                            ...request.payload,
                            group: currentAdmin.group
                        }
                        console.log(request.payload.group)
                        return request
                    }
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
                group: {
                    components: {
                        //edit: AdminJS.bundle("/workspaces/item-input-admin/my-edit.tsx"), // this is our custom component
                        edit: Components.GroupInput,
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
            const matched = bcrypt.compareSync(password, user.encryptedPassword);
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
app.route("/")
    .get((req, res) => {
        res.redirect("/admin");
    });

const port = process.env.PORT || 3000
app.listen(port, function () {
    console.log("Server is up and running on port " + port + ".");
});

export {

};
