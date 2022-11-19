import { ComponentLoader } from 'adminjs'


const componentLoader = new ComponentLoader()

const Components = {
    MyInput: componentLoader.add('MyInput', './my-input'),
    MyImgView: componentLoader.add('MyImgView', './my-img-view'),
    GroupInput: componentLoader.add('GroupInput', './my-group-input'),
    // other custom components
}

export { componentLoader, Components }