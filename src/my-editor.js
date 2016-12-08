import React from 'react';
import {
    Editor,
    EditorState,
    CompositeDecorator,
    ContentState,
    RichUtils,
    Entity,
    AtomicBlockUtils,
    SelectionState,
    convertToRaw,
    Modifier
} from 'draft-js';
import MyWidget from './my-widget';


// const MyWidget = (props) => {
//     //const {url} = props.contentState.getEntity(props.entityKey).getData();
//     let click = () => console.log('s');
//     return (
//         <div>
//             <button onClick={click}>BUTTON</button>
//         </div>
//     );
// };



class MyEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            readOnly: false,
            selectedWidgetKey: undefined
        };
        this.onChange = (editorState) => this.setState({ editorState });

        this.onInsertClick = this.onInsertClick.bind(this);
        this.onLockClick = this.onLockClick.bind(this);
        this.myBlockRenderer = this.myBlockRenderer.bind(this);
        this.onEnterEditMode = this.onEnterEditMode.bind(this);
        this.onUndoClick = this.onUndoClick.bind(this);
        this.onRedoClick = this.onRedoClick.bind(this);
        this.onLogStateClick = this.onLogStateClick.bind(this);
        this.onWidgetUpdate = this.onWidgetUpdate.bind(this);
        this.handlePastedText = this.handlePastedText.bind(this);
    }

    myBlockRenderer(block) {
        if (block.getType() === 'atomic') {
            console.log('myBlockRenderer');
            const entity = Entity.get(block.getEntityAt(0));
            return {
                component: MyWidget,
                editable: false,
                props: {
                    onEnterEditMode: this.onEnterEditMode,
                    onWidgetUpdate: this.onWidgetUpdate,
                    isInEditMode: this.state.selectedWidgetKey === block.getKey()
                }
            };
        }

        return null;
    }

    handlePastedText(text, html){
        console.log('-------paste-----');
        console.log('text: + ' + text);
        console.log('html: + ' + html);
        console.log('--------------------------');
    }

    onLogStateClick() {
        console.log(JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())));
    }

    onUndoClick() {
        const editorState = EditorState.undo(this.state.editorState);
        this.setState({ editorState });
    }
    onRedoClick() {
        const editorState = EditorState.redo(this.state.editorState);
        this.setState({ editorState });
    }

    onEnterEditMode(blockKey) {
        console.log('onEnterEditMode >' + blockKey);
        //force editor update - https://github.com/facebook/draft-js/issues/148
        const editorState = EditorState.forceSelection(this.state.editorState, SelectionState.createEmpty(blockKey));

        this.setState({ selectedWidgetKey: blockKey, editorState });
    }
    onWidgetUpdate(blockKey, data) {
        let newContent = Modifier.setBlockData(this.state.editorState.getCurrentContent(), SelectionState.createEmpty(blockKey), data);

        // console.log(JSON.stringify(convertToRaw(newContent)));
        //Entity.replaceData(blockKey, {xyz:123});
        const editorState = EditorState.push(this.state.editorState, newContent, 'change-block-data')
        this.setState({ editorState });

    }

    onInsertClick(e) {
        e.preventDefault();
        const {editorState, urlValue, urlType} = this.state;
        const entityKey = Entity.create('MY-ATOMIC-ID', 'IMMUTABLE', { src: 'ssss' })

        this.setState({
            editorState: AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' '),
            showURLInput: false,
            urlValue: ''
        }, () => {
            //  setTimeout(() => this.focus(), 0);
        });
    }
    onLockClick() {
        const readOnly = !this.state.readOnly;
        this.setState({ readOnly });
    }



    render() {
        const {editorState, readOnly} = this.state;
        return (
            <div>
                <button onClick={this.onLogStateClick}>log state</button>
                <button onClick={this.onUndoClick}>undo</button>
                <button onClick={this.onRedoClick}>redo</button>
                <button onClick={this.onLockClick}>lock</button>
                <button onClick={this.onInsertClick}>insert</button>
                <Editor editorState={editorState} onChange={this.onChange} blockRendererFn={this.myBlockRenderer}
                    readOnly={readOnly}
                    handlePastedText={this.handlePastedText}
                     />
            </div>
        );
    }
}

export default MyEditor;
