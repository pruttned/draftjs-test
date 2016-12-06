import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class MyWidget extends Component {
    constructor(props) {
        super(props);

        this.onOverlayClick = this.onOverlayClick.bind(this);
    }

    onOverlayClick() {
        this.props.blockProps.onEnterEditMode(this.props.block.getKey());
    }

    componentWillReceiveProps(nextProps) {

    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate(prevProps, prevState) {

    }


    render() {
        const {isInEditMode} = this.props.blockProps;
        const className = classNames({
            widget : true,
            'widget--edit' : isInEditMode
        });
        return (
            <div onClick={this.onOverlayClick} className={className}>
                asd
            </div>
        );
    }
}

MyWidget.propTypes = {
    //   onEnterEditMode: PropTypes.func.isRequired
};

export default MyWidget;