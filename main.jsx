function List() {
  const [list, setList] = React.useState([
    "you",
    "are",
    "the",
    "best",
    "person",
    "i know",
  ]);
  const [comments, setComments] = React.useState([[], [], [], [], [], []]);

  const clonedList = [...list];
  let held, entered;

  function dragEnter(index) {
    entered = index;
  }
  function dragEnd() {
    const temp = clonedList[entered];
    clonedList[entered] = clonedList[held];
    clonedList[held] = temp;
    console.log("clonedList:", clonedList);
    setList(clonedList);
  }

  function dragStart(index) {
    held = index;
  }

  return (
    <div class="list">
      {list.map((item, index) => (
        <Task
          index={index}
          item={item}
          dragStart={dragStart}
          dragEnter={dragEnter}
          dragEnd={dragEnd}
          setComments={setComments}
          comments={comments}
        />
      ))}
    </div>
  );
}

function App() {
  return (
    <main>
      <List />
      <List />
      <List />
      <List />
    </main>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));

function Task({
  index,
  item,
  dragStart,
  dragEnter,
  dragEnd,
  setComments,
  comments,
}) {
  return (
    <div
      class="item"
      draggable
      onDragStart={() => dragStart(index)}
      onDragEnter={() => dragEnter(index)}
      onDragEnd={() => dragEnd()}
    >
      <h3>issue: {item}</h3>
      <div class="comments">
        {comments[index].map((cmnt) => (
          <p>{cmnt}</p>
        ))}
      </div>

      <input type="text" />
      <button
        onClick={() => {
          const input = "this is a comment";
          comments[index].push(input);
          setComments([...comments]);
        }}
      >
        comment
      </button>
    </div>
  );
}

function Task({
  index,
  item,
  dragStart,
  dragEnter,
  dragEnd,
  setComments,
  comments,
}) {
  const [showComments, setShowComments] = React.useState(false);

  return (
    <div
      class="item"
      draggable
      onDragStart={() => dragStart(index)}
      onDragEnter={() => {
        dragEnter(index);
      }}
      onDragEnd={dragEnd}
    >
      <h3>issue: {item}</h3>
      <button onClick={() => setShowComments(!showComments)}>{showComments? "hide comments": "show comments"} </button>
      {showComments? <div class="comments">
        {comments[index].map((cmnt) => (
          <p>{cmnt}</p>
        ))}
      </div>: ""}

      <input type="text" />
      <button
        onClick={() => {
          const input = "this is a comment";
          comments[index].push(input);
          setComments([...comments]);
          setShowComments(true)
        }}
      >
        comment
      </button>
    </div>
  );
}
