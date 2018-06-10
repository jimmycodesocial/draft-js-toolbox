# DraftJs Toolbox
Useful goodies for DraftJS.

## Installation

```
npm install @jimmycode/draft-js-toolbox
```

## Usage
This library contains two sets of functions:
1. Utilities: that determine certain conditions on the editor's state.
2. Modifiers: which perform transformations on the editor's state.

#### Utils

| Function              | Params                          | Description                                                                  |
|-----------------------|---------------------------------|------------------------------------------------------------------------------|
| getCurrentBlock       | editorState                     | Returns the current block selected.                                          |
| isCurrentBlockType    | editorState, blockType          | Checks the current block's type.                                             |
| isBlockWithEntityType | editorState, block, entityType  | Checks if the current block is an atomic block with an specific entity type. |

#### Modifiers

| Function       | Params                        | Description                                                     |
|----------------|-------------------------------|-----------------------------------------------------------------|
| addBlock       | editorState, entityType, data | Changes the current block's type and replace its data.          |
| addAtomicBlock | editorState, entityType, data | Inserts an atomic block and creates an Entity with custom data. |
| removeBlock    | editorState, blockKey         | Removes a block given its key.                                  |

