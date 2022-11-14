import { ComponentLoader } from 'adminjs'


const componentLoader = new ComponentLoader()

const Components = {
    MyInput: componentLoader.add('MyInput', './my-input'),
    MyImgView: componentLoader.add('MyImgView', './my-img-view'),
    // other custom components
}

export { componentLoader, Components }