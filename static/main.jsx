class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1 style={{ color: "red" }}>
          it seams that an error has accured, call 574-329-1927 for further help
          and assistance
        </h1>
      );
    }
    return this.props.children;
  }
}

function changeBackgroundColor(event) {
  event.preventDefault();
  const colorPicker = document.getElementById("backGroundcolorPicker");
  document.body.style.backgroundColor = colorPicker.value;
}

const EmptyListMessage = () => {
  return (
    <h3 style={{ color: "darkorange", padding: "8px" }}>
      This list is empty. would you like to add a task?
    </h3>
  );
};

function List({
  listName,
  rowIndex,
  list,
  comments,
  dragEnter,
  dragEnd,
  entered,
  addTask,
  deleteList,
}) {
  const inputRef = React.useRef();
  return (
    <ErrorBoundary fallback="error is List">
      <div
        class={entered ? "list entered" : "list"}
        onDragEnter={() => {
          dragEnter(rowIndex);
        }}
        onDragEnd={dragEnd}
      >
        <button
          class="delete-list-button"
          onClick={() => {
            deleteList(rowIndex);
          }}
        >
          X
        </button>

        <h1>{listName}</h1>
        {list.length == 0 ? (
          <EmptyListMessage />
        ) : (
          list.map((item, colIndex) => (
            <Task {...{ colIndex, rowIndex, item, comments }} />
          ))
        )}
        <form class="add-task-form">
          <input ref={inputRef} type="text" />
          <button
            onClick={(e) => {
              e.preventDefault();
              const inputText = inputRef.current.value;
              inputRef.current.value = "";
              if (!inputText) {
                return;
              }
              addTask(rowIndex, inputText);
            }}
          >
            add task
          </button>
        </form>
      </div>
    </ErrorBoundary>
  );
}

function App() {
  const [lists, setLists] = React.useState([[]]);
  const [comments, setComments] = React.useState([[[]]]);
  const [listNames, setListNames] = React.useState([""]);

  let held, entered;

  const getData = async () => {
    const response = await fetch("/data");
    const data = await response.json();
    console.log(data);
    setLists(data["lists"]);
    setComments(data["comments"]);
    setListNames(data["listNames"]);
  };

  React.useEffect(getData, []);

  React.useEffect(() => {
    fetch("/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lists,
        comments,
        listNames,
      }),
    })
      .then((res) => res.text())
      .catch((err) => console.error(err));
  }, [lists, comments, listNames]);

  function addList() {
    setLists([...lists, []]);
    setComments([...comments, []]);
    setListNames([...listNames, prompt("new category: ")]);
  }

  function deleteList(listIndex) {
    const clonedLists = [...lists];
    const clonedComments = [...comments];
    const clonedListNames = [...listNames];

    clonedComments.splice(listIndex, 1);
    clonedComments.splice(listIndex, 1);
    clonedListNames.splice(listIndex, 1);

    console.log(clonedListNames);

    setLists(clonedLists);
    setComments(clonedComments);
    setListNames(clonedListNames);
  }

  function createComment(rowIndex, colIndex, input) {
    comments[rowIndex][colIndex].push(`${thisUser}: ${input}`);
    setComments([...comments]);
  }

  function deleteTask(rowIndex, colIndex) {
    const clonedLists = [...lists];
    const clonedComments = [...comments];

    clonedLists[rowIndex].splice(colIndex, 1);
    clonedComments[rowIndex].splice(colIndex, 1);

    setLists(clonedLists);
    setComments(clonedComments);
  }
  function editTask(rowIndex, colIndex, newTaskName) {
    if (newTaskName) {
      const clonedLists = [...lists];

      clonedLists[rowIndex][colIndex] = newTaskName;

      setLists(clonedLists);
    }
  }

  function addTask(rowIndex, inputText) {
    const clonedLists = [...lists];
    const clonedComments = [...comments];

    clonedLists[rowIndex].push(inputText);
    clonedComments[rowIndex].push([]);

    setLists(clonedLists);
    setComments(clonedComments);
  }

  function dragStart(rowIndex, colIndex) {
    held = [rowIndex, colIndex];
  }

  function dragEnter(rowIndex) {
    entered = rowIndex;
  }
  function dragEnd() {
    const [rowIndex, colIndex] = held;

    const clonedLists = [...lists];
    const clonedComments = [...comments];

    clonedLists[entered].push(lists[rowIndex][colIndex]);
    clonedLists[rowIndex].splice(colIndex, 1);

    clonedComments[entered].push(comments[rowIndex][colIndex]);
    clonedComments[rowIndex].splice(colIndex, 1);

    setLists(clonedLists);
    setComments(clonedComments);
  }

  return (
    <main>
      <ErrorBoundary fallback="error is App">
        <createCommentContext.Provider value={createComment}>
          <dragContext.Provider value={dragStart}>
            <deleteTaskContext.Provider value={deleteTask}>
              <editTaskContext.Provider value={editTask}>
                {listNames.map((listName, rowIndex) => (
                  <List
                    {...{
                      listName,
                      rowIndex,
                      comments,
                      dragEnter,
                      dragEnd,
                      addTask,
                      deleteList,
                    }}
                    entered={entered == rowIndex}
                    list={lists[rowIndex]}
                  />
                ))}
              </editTaskContext.Provider>
            </deleteTaskContext.Provider>
          </dragContext.Provider>
        </createCommentContext.Provider>
      </ErrorBoundary>

      <button id="add-category-button" onClick={addList}>
        add a category
      </button>
    </main>
  );
}

function Task({ rowIndex, colIndex, item, comments }) {
  const dragStart = React.useContext(dragContext);
  const deleteTask = React.useContext(deleteTaskContext);
  const editTask = React.useContext(editTaskContext);

  return (
    <ErrorBoundary fallback="error in Task">
      <div
        class="item"
        draggable
        onDragStart={() => dragStart(rowIndex, colIndex)}
      >
        <div className="delete-and-edit-task-buttons">
          <button
            class="delete-task-button"
            onClick={() => {
              deleteTask(rowIndex, colIndex);
            }}
          >
            X
          </button>
          <img
            class="edit-button"
            src="static/assets/notepad.png"
            onClick={() =>
              editTask(rowIndex, colIndex, prompt("new task name: "))
            }
            alt=""
          />
        </div>

        <div class="task-name">
          <h3>{item}</h3>
        </div>
        <CommentsManager
          {...{ rowIndex, colIndex }}
          comments={comments[rowIndex][colIndex]}
        />
      </div>
    </ErrorBoundary>
  );
}

function AddCommentForm({ rowIndex, colIndex }) {
  const commentInputRef = React.useRef();
  const createComment = React.useContext(createCommentContext);

  return (
    <form>
      <input ref={commentInputRef} type="text" />
      <button
        type="submit"
        onClick={(event) => {
          event.preventDefault();
          const input = commentInputRef.current.value;
          commentInputRef.current.value = "";

          if (!input) {
            alert("no content provided as input");
            return;
          }

          createComment(rowIndex, colIndex, input);
        }}
      >
        comment
      </button>
    </form>
  );
}

function CommentsManager({ comments, rowIndex, colIndex }) {
  const [showComments, setShowComments] = React.useState(true);
  return (
    <div className="comments-manager">
      {comments.length ? (
        <button onClick={() => setShowComments(!showComments)}>
          {showComments
            ? "hide comments"
            : `show (${comments.length}) comments`}
        </button>
      ) : (
        ""
      )}

      {showComments ? (
        <div class="comments">
          {comments
            .slice()
            .reverse()
            .map((cmnt) => (
              <p>{cmnt}</p>
            ))}
        </div>
      ) : (
        ""
      )}
      <AddCommentForm
        {...{
          rowIndex,
          colIndex,
        }}
      />
    </div>
  );
}

const thisUser = "shmuli";
const dragContext = React.createContext(null);
const deleteTaskContext = React.createContext(null);
const createCommentContext = React.createContext(null);
const editTaskContext = React.createContext(null);
ReactDOM.render(<App />, document.querySelector("#root"));
