const ATOMIC = 'atomic';

export const getCurrentBlock = (editorState) => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const block = contentState.getBlockForKey(selectionState.getStartKey());

  return block;
};

export const isCurrentBlockType = (editorState, blockType) => {
  return getCurrentBlock(editorState).getType() === blockType;
};

export const isBlockWithEntityType = (editorState, block, entityType) => {
  if (block.getType() !== ATOMIC) {
    return false;
  }

  const contentState = editorState.getCurrentContent();
  const entityKey = block.getEntityAt(0);

  if (!entityKey) {
    return false;
  }

  const entity = contentState.getEntity(entityKey);

  return entity.getType() === entityType;
};
