const EmptyListMessage = () => {
    return (
            <h3 style={{ color: 'darkorange', padding: "8px" }}>This list is empty. would you like to add a task</h3>
    )
}


function List({ listName, rowIndex, list, comments, setComments, dragEnter, dragEnd, entered, addTask }) {
    const inputRef = React.useRef()
  return (
    <div class={entered? "list entered": "list"}
    onDragEnter={() => {
        dragEnter(rowIndex);
      }}
     
      onDragEnd={dragEnd}>
      <h1>
        #{rowIndex + 1}: {listName}
      </h1>
      {list.length == 0?  <EmptyListMessage/>: list.map((item, colIndex) => (
        <Task {...{ colIndex, rowIndex, item, setComments, comments }} />
      ))}
      <form class="add-task-form">
        <input ref={inputRef} type="text" />
      <button onClick={(e) => {
        e.preventDefault()
        const inputText = inputRef.current.value;
        inputRef.current.value = "";
        if (!inputText){
            return
        }
        addTask(rowIndex, inputText)
      }}>add task</button>
      </form>
    </div>
  );
}

function App() {
  const [lists, setLists] = React.useState([
    [],[],[]
  ]);
  const [comments, setComments] = React.useState([
    [],[],[]
  ]);

  let held, entered;

  function deleteTask(rowIndex, colIndex){
    const clonedLists = [...lists];
    const clonedComments = [...comments];

    delete clonedLists[rowIndex][colIndex]
    delete clonedComments[rowIndex][colIndex]

    setLists(clonedLists)
    setComments(clonedComments)
  }

  function addTask(rowIndex, inputText){
    const clonedLists = [...lists];
    const clonedComments = [...comments];

    clonedLists[rowIndex].push(inputText)
    clonedComments[rowIndex].push([])

    setLists(clonedLists)
    setComments(clonedComments)
  }

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
      <deleteTaskContext.Provider value={deleteTask}>
        {listNames.map((listName, rowIndex) => (
          <List
            {...{ listName, rowIndex, comments, setComments, dragEnter, dragEnd, addTask }}
            entered={entered == rowIndex}
            list={lists[rowIndex]}
          />
        ))}
      </deleteTaskContext.Provider>
      </dragContext.Provider>
    </main>
  );
}


function Task({ rowIndex, colIndex, item, setComments, comments }) {
  const [showComments, setShowComments] = React.useState(true);
  const commentInputRef = React.useRef();
  const dragStart  = React.useContext(dragContext);
  const deleteTask  = React.useContext(deleteTaskContext);

  return (
    <div
      class="item"
      draggable
      onDragStart={() => dragStart(rowIndex, colIndex)}
    >
        <button class="delete-task-button" onClick={() => {deleteTask(rowIndex, colIndex)}}>X</button>
      <h3 class="issue-text">issue: {item}</h3>
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
            comments[rowIndex][colIndex].push(`${thisUser}: ${input}`);
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

const thisUser = "shmuli"
const dragContext = React.createContext(null);
const deleteTaskContext = React.createContext(null);
ReactDOM.render(<App />, document.querySelector("#root"));
