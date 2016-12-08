import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import {
    Entity
} from 'draft-js';

class MyWidget extends Component {
    constructor(props) {
        super(props);

        this.onOverlayClick = this.onOverlayClick.bind(this);
        this.onEditorUpdateClick = this.onEditorUpdateClick.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
    }

    onFileChange(evt) {
        let input = evt.target;

        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = e => this.props.blockProps.onWidgetUpdate(this.props.block.getKey(), { imgData: e.target.result });
            reader.readAsDataURL(input.files[0]);
        }
    }

    onOverlayClick() {
        this.props.blockProps.onEnterEditMode(this.props.block.getKey());
    }

    onEditorUpdateClick(e) {
        e.stopPropagation();
        console.log('sd');
        this.props.blockProps.onWidgetUpdate(this.props.block.getKey(), 123);
    }

    componentWillReceiveProps(nextProps) {

    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    //http://stackoverflow.com/a/4459419

    render() {
        // let eee = Entity.get(this.props.block.getEntityAt(0));
        // let data = Entity.get(this.props.block.getEntityAt(0)).getData();

        // console.log('--this.props.block.getData--');
        // console.log(this.props.block.getData().get('abc'));
        // console.log('-------------------');
        // console.log('Entity.get(this.props.block.getEntityAt(0))');
        // console.log(eee);
        // console.log('-------------------');
        // console.log('---this.props.block---');
        // console.log(this.props.block);
        // console.log('-------------------');

        const imgData = this.props.block.getData().get('imgData');

        const {isInEditMode} = this.props.blockProps;
        const className = classNames({
            widget: true,
            'widget--edit': isInEditMode
        });
        const editor = isInEditMode ? this.renderEditor() : null;
        return (
            <div onClick={this.onOverlayClick} className={className}>
                <img src={imgData}/>
                zz
                {editor}
            </div>
        );
    }

    renderEditor() {
        return (
            <div>
                <div>editor</div>
                <button onClick={this.onEditorUpdateClick}>update</button>
                <input type="file" onChange={this.onFileChange}></input>
            </div>
        );
    }
}

MyWidget.propTypes = {
    //   onEnterEditMode: PropTypes.func.isRequired
};

export default MyWidget;