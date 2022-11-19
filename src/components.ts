import { ComponentLoader } from 'adminjs'


const componentLoader = new ComponentLoader()

const Components = {
    MyInput: componentLoader.add('MyInput', './my-input'),
    MyImgView: componentLoader.add('MyImgView', './my-img-view'),
    //InputGroup: componentLoader.add('InputGroup', './my-group-input'),
    // other custom components
}

export { componentLoader, Components }