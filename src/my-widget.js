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

        const abcData = this.props.block.getData().get('abc');

        const {isInEditMode} = this.props.blockProps;
        const className = classNames({
            widget: true,
            'widget--edit': isInEditMode
        });
        const editor = isInEditMode ? this.renderEditor() : null;
        return (
            <div onClick={this.onOverlayClick} className={className}>
                asd --{abcData}--
                {editor}
            </div>
        );
    }

    renderEditor() {
        return (
            <div>
                <div>editor</div>
                <button onClick={this.onEditorUpdateClick}>update</button>
            </div>
        );
    }
}

MyWidget.propTypes = {
    //   onEnterEditMode: PropTypes.func.isRequired
};

export default MyWidget;