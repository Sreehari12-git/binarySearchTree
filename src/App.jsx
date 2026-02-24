import React, {useState, useEffect} from "react";
import "./App.css";

class Node {
  constructor(value) { //Run when a node is created
    this.value = value; //Stores the number inside the node
    this.left = null; // At first the node has no left child so its null
    this.right = null; // Also starts as null
  }
}

// function that inserts a value into the Binary Search Tree.
// root - current node that we are checking
// value - number we want to insert
const insertNode = (root, value) => {
  // If there is no node here, create a new node and return it
  if(!root) return new Node(value);
  if(value < root.value) {
    root.left = insertNode(root.left, value);
  } else {
    root.right = insertNode(root.right, value);
  }
  // After insertion is done,we return the updated root.
  return root;
}

//Function to search a value in BST
//root-current node
//value - number we are searching for
const findNode = (root, value) => {
  // If we reach a null node,that means the value does not exist in the tree.
  if(!root) return false;
  if(value === root.value) return true;
  if(value < root.value) return findNode(root.left, value);
  return findNode(root.right, value);
}

//Function to delete a value in BST
const deleteNode = (root, value) => {
  //If we reach null,value doesn’t exist.Return null.
  if(!root) return null;
  if(value < root.value) {
    root.left = deleteNode(root.left, value);
  } else if(value > root.value) {
    root.right = deleteNode(root.right,value);
  } else {
    //Three cases
    //If no left child, Just return the right child.
    if(!root.left) return root.right;
    //If no right child, Just return the left child.
    if(!root.right) return root.left;
    //Find Minimum in Right Subtree Why?The smallest value in right subtree is the correct replacement.
    let minNode = root.right;
    while(minNode.left) {
      minNode = minNode.left;
    }
    root.value = minNode.value;
    root.right = deleteNode(root.right, minNode.value);
  }
  return root;
}

//Function to print bst in sorted order
//result = [] - if no second argument is provided create a new empty array(default paramter)
const inOrderTraversal = (root, result =[]) => {
  if(!root) return result;
  //Visit left subtree first
  inOrderTraversal(root.left, result)
  //Add current nodes value
  result.push(root.value);
  inOrderTraversal(root.right, result)
  return result;
}

//Displaying the node
const TreeView = ({ node }) => {
  if (!node) return null;

  return (
    <ul className="tree">
      <li>
        <div className="node-circle">{node.value}</div>

        {(node.left || node.right) && (
          <ul>
            <li>
              {node.left ? <TreeView node={node.left} /> : <span className="empty"></span>}
            </li>
            <li>
              {node.right ? <TreeView node={node.right} /> : <span className="empty"></span>}
            </li>
          </ul>
        )}
      </li>
    </ul>
  );
};

//Component declaration
//export default - allows the component to be imported in main.jsx
export default function BinarySearchTreeApp() {
  //input-current value inside text box
  //setInput - function to update it
  const [input, setInput] = useState("");
  //root → the top node of the tree
  //setRoot → updates the tree
  //null → initially empty tree
  const [root, setRoot] = useState(null);
  //Stores status messages like:"Inserted 10","Deleted 5","10 not found"
  const [message, setMessage] = useState("");
  //This one loads saved tree when page loads.
  // Load from localStorage
  // useEffect(() => {
  //   //Gets data saved under key "bst".If something was saved before, it returns a string.
  //   const storedTree = localStorage.getItem("bst");
  //   if (storedTree) {
  //     //localStorage stores data as string.JSON.parse() converts string → object.setRoot() updates state.
  //     setRoot(JSON.parse(storedTree));
  //   }
  //   //empty array [] means:Run this effect only once (when component mounts).
  // },[])

  useEffect(() => {
  localStorage.removeItem("bst");
  setRoot(null);
}, []);

  //Save to localstorage- Runs when root changes
  // useEffect(() => {
  //   if(root) {
  //     //Converts tree object to string. Save to local storage
  //     localStorage.setItem("bst",JSON.stringify(root));
  //   } else {
  //     //If tree is cleared → remove storage.
  //     localStorage.removeItem("bst");
  //   }
  //   //Runs this effect every time when root changes
  // }, [root]);

  //This function runs when the user clicks the Insert button.
    // It does 4 important things:
    //   Takes value from input box
    //   Validates it
    //   Inserts it into the BST
    //   Updates the UI
  const handleInsert = () => {
  //Input is converted to number from string
  const value = parseInt(input);
  //if not a number function stops immediately
  if (isNaN(value)) return;
  const newRoot = insertNode(root, value);
  //Update react state
  setRoot({ ...newRoot });
  //Shows the message
  setMessage(`Inserted ${value}`);
  //Resets the input field
  setInput("");
  };
  //Delete the input value by clicking
  const handleDelete = () => {
    const value = parseInt(input);
    //isNaN - is not a number
    if (isNaN(value)) return;

    const newRoot = deleteNode(root, value);
    setRoot(newRoot ? { ...newRoot } : null);
    setMessage(`Deleted ${value}`);
    setInput("");
  };

  //Runs when find button is clicked
  const handleFind = () => {
    const value = parseInt(input);
    if (isNaN(value)) return;

    const found = findNode(root, value);
    //if value is found then true else false
    setMessage(found ? `${value} found` : `${value} not found`);
    setInput("");
  };
  //Runs when print button is clicked
  const handlePrint = () => {
    //returns a sorted array
    const result = inOrderTraversal(root);
    //converts array to string
    setMessage(`InOrder: ${result.join(", ")}`);
  };

  // const clearTree = () => {
  //   setRoot(null);
  //   setMessage("Tree cleared");
  // };
   return (
    <div className="bt-content" >
      <div className="bst-heading">
        <h1>Binary Search Tree</h1>
      </div>

      <div className="input-field">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter value"
          style={{ padding: "5px" }}
        />
        <button onClick={handleInsert}>Insert</button>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleFind}>Find</button>
        <button onClick={handlePrint}>Print</button>
        {/* <button onClick={clearTree}>Clear</button> */}
      </div>

      <div style={{ padding: "20px" }}>
        {message && (
          <div className="display-message"
          >
            {message}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center" }}>
          <TreeView node={root} />
        </div>
      </div>
    </div>
  );
}
