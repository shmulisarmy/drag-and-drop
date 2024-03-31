function List({ listName, rowIndex, list, comments, setComments, dragEnter, dragEnd, entered }) {
    
  return (
    <div class={entered? "list entered": "list"}
    onDragEnter={() => {
        dragEnter(rowIndex);
      }}
     
      onDragEnd={dragEnd}>
      <h1>
        #{rowIndex + 1}: {listName}
      </h1>
      {list.map((item, colIndex) => (
        <Task {...{ colIndex, rowIndex, item, setComments, comments }} />
      ))}
    </div>
  );
}

function App() {
  const [lists, setLists] = React.useState([
    ["you", "are", "the"],
    ["best", "person", "i know"],
    ["the", "coolest", "person"],
  ]);
  const [comments, setComments] = React.useState([
    [[], [], []],
    [[], [], []],
    [[], [], []],
  ]);

  let held, entered;

  function dragStart(rowIndex, colIndex) {
    held = [rowIndex, colIndex];
  }

  function dragEnter(rowIndex) {
      
      entered = rowIndex
  }
  function dragEnd() {
    const [rowIndex, colIndex] = held

    const clonedLists = [...lists];
    const clonedComments = [...comments];
    
    clonedLists[entered].push(lists[rowIndex][colIndex])
    delete clonedLists[rowIndex][colIndex]

    clonedComments[entered].push(comments[rowIndex][colIndex])
    delete clonedComments[rowIndex][colIndex]

    setLists(clonedLists)
    setComments(clonedComments)
  }

  const listNames = ["todo", "doing", "done"];
  return (
    <main>
      <dragContext.Provider value={dragStart}>
        {listNames.map((listName, rowIndex) => (
          <List
            {...{ listName, rowIndex, comments, setComments, dragEnter, dragEnd }}
            entered={entered == rowIndex}
            list={lists[rowIndex]}
          />
        ))}
      </dragContext.Provider>
    </main>
  );
}


function Task({ rowIndex, colIndex, item, setComments, comments }) {
  const [showComments, setShowComments] = React.useState(true);
  const commentInputRef = React.useRef();
  const dragStart  = React.useContext(dragContext);

  return (
    <div
      class="item"
      draggable
      onDragStart={() => dragStart(rowIndex, colIndex)}
    >
      <h3>issue: {item}</h3>
      <button onClick={() => setShowComments(!showComments)}>
        {showComments ? "hide comments" : "show comments"}{" "}
      </button>
      {showComments ? (
        <div class="comments">
          {comments[rowIndex][colIndex].map((cmnt) => (
            <p>{cmnt}</p>
          ))}
        </div>
      ) : (
        ""
      )}
      <form>
        <input ref={commentInputRef} type="text" />
        <button
          type="submit"
          onClick={(event) => {
            event.preventDefault();
            const input = commentInputRef.current.value;
            if (!input) {
                alert("no content provided as input")
              return;
            }
            comments[rowIndex][colIndex].push(input);
            commentInputRef.current.value = "";
            setComments([...comments]);
            setShowComments(true);
          }}
        >
          comment
        </button>
      </form>
    </div>
  );
}

const dragContext = React.createContext(null);
ReactDOM.render(<App />, document.querySelector("#root"));
