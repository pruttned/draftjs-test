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
    Modifier,
    convertFromHTML,
    DefaultDraftBlockRenderMap,
    getSafeBodyFromHTML
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
        this.onInserReachTextClick = this.onInserReachTextClick.bind(this);
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

    onInserReachTextClick() {
        // const html = '<h1>a</h1><p>b</p><p><ul><li>x</li><li>y</li><li>z</li></ul></p>';
        // const content = ContentState.createFromBlockArray(convertFromHTML(html));


        // let currentContentState = this.state.editorState.getCurrentContent();
        // let currentBlockMap = currentContentState.getBlockMap();
        // let blockMap = content.getBlockMap();
        // currentBlockMap = currentBlockMap.merge(blockMap);
        // // contentState = contentState.merge({ blockMap });

        // console.log(currentBlockMap.toJS());

        // currentContentState = currentContentState.merge({ blockMap: currentBlockMap });

        // const editorState = EditorState.push(this.state.editorState, currentContentState, 'insert-characters')
        // this.setState({ editorState });

        // console.log(blockMap.toJS());
        // console.log(content);

        //https://github.com/facebook/draft-js/issues/523
        const blockRenderMap = DefaultDraftBlockRenderMap.set('p', { element: 'p' });

        //https://github.com/facebook/draft-js/issues/416#issuecomment-221639163
        let {editorState} = this.state;
        const html = '<h1>a</h1><p>a</p><p>b</p><p><ul><li>x</li><li>y</li><li>z</li></ul></p>';

        //TODO: https://github.com/facebook/draft-js/issues/523
        let blocksFromHtml = convertFromHTML(html, getSafeBodyFromHTML, blockRenderMap)
            .map(b => (b.get('type') === 'p' ? b.set('type', 'unstyled') : b));
        const blockMap = ContentState.createFromBlockArray(blocksFromHtml).getBlockMap();

        const newContentState = Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), blockMap);

        editorState = EditorState.push(editorState, newContentState, 'insert-characters')
        this.setState({ editorState });
    }

    handlePastedText(text, html) {
        console.log('-------paste-----');
        console.log('text: + ' + text);
        console.log('html: + ' + html);
        console.log('--------------------------');


        const blockRenderMap = DefaultDraftBlockRenderMap.set('p', { element: 'p' });

        //https://github.com/facebook/draft-js/issues/416#issuecomment-221639163
        let {editorState} = this.state;

        //TODO: https://github.com/facebook/draft-js/issues/523
        let blocksFromHtml = convertFromHTML(html, getSafeBodyFromHTML, blockRenderMap)
            .map(b => (b.get('type') === 'p' ? b.set('type', 'unstyled') : b));
        const blockMap = ContentState.createFromBlockArray(blocksFromHtml).getBlockMap();

        const newContentState = Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), blockMap);

        editorState = EditorState.push(editorState, newContentState, 'insert-characters')
        this.setState({ editorState });


        return true;
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
                <button onClick={this.onInserReachTextClick}>inser reach</button>
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
