function List({ listName, rowIndex, list, comments, setComments }) {
  return (
    <div class="list">
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

  function dragEnter(rowIndex, colIndex) {
    entered = [rowIndex, colIndex];
  }
  function dragEnd() {
    const clonedLists = [...lists];
    const clonedComments = [...comments];

    var temp = clonedLists[entered[0]][entered[1]];
    clonedLists[entered] = clonedLists[entered[0]][entered[1]];
    clonedLists[held] = temp;
    console.log("clonedLists:", clonedLists);
    setLists(clonedLists);

    temp = clonedComments[entered[0]][entered[1]];
    clonedComments[entered[0]][entered[1]] =
      clonedComments[entered[0]][entered[1]];
    clonedComments[entered[0]][entered[1]] = temp;
    console.log("clonedComments:", clonedComments);
    setComments(clonedComments);
  }

  const listNames = ["todo", "doing", "done"];
  return (
    <main>
      <dragContext.Provider value={{ dragStart, dragEnter, dragEnd }}>
        {listNames.map((listName, rowIndex) => (
          <List
            {...{ listName, rowIndex, comments, setComments }}
            list={lists[rowIndex]}
          />
        ))}
      </dragContext.Provider>
    </main>
  );
}


function Task({ rowindex, colindex, item, setComments, comments }) {
  const [showComments, setShowComments] = React.useState(true);
  const commentInputRef = React.useRef();
  const { dragStart, dragEnter, dragEnd } = React.useContext(dragContext);

  return (
    <div
      class="item"
      draggable
      onDragStart={() => dragStart(rowindex, colindex)}
      onDragEnter={() => {
        dragEnter(rowindex, colindex);
      }}
      onDragEnd={dragEnd}
    >
      <h3>issue: {item}</h3>
      <button onClick={() => setShowComments(!showComments)}>
        {showComments ? "hide comments" : "show comments"}{" "}
      </button>
      {showComments ? (
        <div class="comments">
          {comments[rowindex][colindex].map((cmnt) => (
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
            comments[rowindex][colindex].push(input);
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
