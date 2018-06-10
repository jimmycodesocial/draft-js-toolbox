import { SelectionState, EditorState, Modifier, AtomicBlockUtils } from 'draft-js';
import { getCurrentBlock } from './editor';

export const addBlock = (editorState, entityType, data = {}) => {
  const selectionState = editorState.getSelection();

  if (!selectionState.isCollapsed()) {
    return editorState;
  }

  const contentState = editorState.getCurrentContent();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const currentBlock = getCurrentBlock(editorState);

  if (!currentBlock || currentBlock.getLength() !== 0 || currentBlock.getType() === entityType) {
    return editorState;
  }

  const newBlock = currentBlock.merge({
    type: entityType,
    data: data,
  });

  const newContentState = contentState.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: selectionState,
  });

  return EditorState.push(editorState, newContentState, 'change-block-type');
};

export const addAtomicBlock = (editorState, entityType, data = {}) => {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(entityType, 'IMMUTABLE', data);
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  
  const newEditorState = AtomicBlockUtils.insertAtomicBlock(
    editorState,
    entityKey,
    ' '
  );

  return EditorState.forceSelection(
    newEditorState,
    newEditorState.getCurrentContent().getSelectionAfter()
  );
}

/**
 * Copied and modified from
 * https://github.com/mediasilo/draft-js-plugins/blob/1a31082576f7f1d8e682a99bd9868f76c60aee45/draft-js-dnd-plugin/src/modifiers/removeBlock.js
 */
export const removeBlock = (editorState, blockKey) => {
  let content = editorState.getCurrentContent();
  const block = content.getBlockForKey(blockKey);

  const newSelection = new SelectionState({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: block.getLength(),
  });

  const afterKey = content.getKeyAfter(blockKey);
  const afterBlock = content.getBlockForKey(afterKey);
  let targetRange;

  // Only if the following block the last with no text then the whole block should be removed. 
  // Otherwise the block should be reduced to an unstyled block without any characters.
  if (
    afterBlock && 
    afterBlock.getType() === 'unstyled' && 
    afterBlock.getLength() === 0 && 
    afterBlock === content.getBlockMap().last()) {
      
    targetRange = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: afterKey,
      focusOffset: 0,
    });
  } 
  else {
    targetRange = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: 1,
    });
  }

  // Change the blocktype and remove the characterList entry with the block
  content = Modifier.setBlockType(
    content,
    targetRange,
    'unstyled'
  );

  content = Modifier.removeRange(content, targetRange, 'backward');

  // Force to new selection
  const newState = EditorState.push(editorState, content, 'remove-block');

  return EditorState.forceSelection(newState, newSelection);
}
