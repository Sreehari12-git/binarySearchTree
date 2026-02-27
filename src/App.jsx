import React, {useState, useEffect, useRef} from "react";
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
  // ✅ If duplicate, do nothing
  if (value === root.value) {
    return root;
  }
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

//makes node clickable
const TreeView = ({ node, onSelect }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const drawLines = () => {
      const svg = containerRef.current.querySelector("svg");
      svg.innerHTML = "";

      const nodes = containerRef.current.querySelectorAll(".node-circle");

      nodes.forEach((nodeEl) => {
        const parent = nodeEl.parentElement.parentElement.closest(".tree-node");
        if (!parent) return;

        const parentCircle = parent.querySelector(".node-circle");
        if (!parentCircle) return;

        const rect1 = parentCircle.getBoundingClientRect();
        const rect2 = nodeEl.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        const x1 = rect1.left + rect1.width / 2 - containerRect.left;
        const y1 = rect1.bottom - containerRect.top;
        const x2 = rect2.left + rect2.width / 2 - containerRect.left;
        const y2 = rect2.top - containerRect.top;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", "#444");
        line.setAttribute("stroke-width", "2");

        svg.appendChild(line);
      });
    };

    setTimeout(drawLines, 0);
  });

  if (!node) return null;

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <RenderNode node={node} onSelect={onSelect} />
      </div>
    </div>
  );
};



const RenderNode = ({ node, onSelect }) => {
  if (!node) return null;

  return (
    <div className="tree-node">
<div
  className="node-circle"
  onClick={() => onSelect(node.value)}
  style={{ cursor: "pointer" }}
>
  {node.value}
</div>
      {(node.left || node.right) && (
        <div className="children">
          <div className="lchild">
<RenderNode node={node.left} onSelect={onSelect} />          </div>
          <div className="rchild">
<RenderNode node={node.right} onSelect={onSelect} />          </div>
        </div>
      )}
    </div>
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
const handleSelect = (value) => {
  setSelectedNodes(prev => {
    if (prev.length === 2) return [value];
    return [...prev, value];
  });
};
//To store two clicked nodes and to display the calculated relationship
const [selectedNodes, setSelectedNodes] = useState([]);
const [relationMessage, setRelationMessage] = useState("");
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
    useEffect(() => {
  if (selectedNodes.length === 2) {
    const [a, b] = selectedNodes;

    const infoA = findNodeInfo(root, a);
    const infoB = findNodeInfo(root, b);

    if (!infoA || !infoB) return;

    const gender = (num) => num % 2 === 0 ? "male" : "female";

    const title = {
      parent: (n) => gender(n) === "male" ? "father" : "mother",
      grand: (n) => gender(n) === "male" ? "grandfather" : "grandmother",
      greatGrand: (n) => gender(n) === "male" ? "great-grandfather" : "great-grandmother",
      uncle: (n) => gender(n) === "male" ? "uncle" : "aunt",
      sibling: (n) => gender(n) === "male" ? "brother" : "sister"
    };

    let relation = "No relation";

    // 1️⃣ Direct Parent
    if (infoA.parent && infoA.parent.value === b) {
      relation = `${b} (${title.parent(b)}) -> ${a} (child)`;
    }
    //user can select nodes in any order so that is why we give this condition
    else if (infoB.parent && infoB.parent.value === a) {
      relation = `${a} (${title.parent(a)}) -> ${b} (child)`;
    }

    // 2️⃣ Ancestor Based on Level Difference
    else if (infoA.ancestors.some(n => n.value === b)) {
      //checks if one node appears in another ancestors list
      const diff = infoA.level - infoB.level;
      
      if (diff === 2)
        relation = `${b} (${title.grand(b)}) -> ${a} (grandchild)`;
      else if (diff === 3)
        relation = `${b} (${title.greatGrand(b)}) -> ${a} (great-grandchild)`;
      else if (diff > 3)
        relation = `${b} (ancestor ${diff-1} levels above) -> ${a}`;
    }
    else if (infoB.ancestors.some(n => n.value === a)) {
      const diff = infoB.level - infoA.level;

      if (diff === 2)
        relation = `${a} (${title.grand(a)}) -> ${b} (grandchild)`;
      else if (diff === 3)
        relation = `${a} (${title.greatGrand(a)}) -> ${b} (great-grandchild)`;
      else if (diff > 3)
        relation = `${a} (ancestor ${diff-1} levels above) -> ${b}`;
    }

    // 3️⃣ Siblings
    else if (
      infoA.parent &&
      infoB.parent &&
      infoA.parent.value === infoB.parent.value
    ) {
      relation = `${a} (${title.sibling(a)}) <-> ${b} (${title.sibling(b)})`;
    }
    // 5️⃣ Cousins
   else if (
  infoA.parent &&
  infoB.parent &&
  infoA.parent.value !== infoB.parent.value &&
  infoA.level === infoB.level
) {
  relation = `${a} and ${b} are cousins`;
}// 4️⃣ Uncle / Aunt (Parent's sibling)
// 4️⃣ Uncle / Aunt (Parent's sibling)
else if (
  infoB.parent &&
  infoA.parent &&
  infoA.parent &&
  infoB.parent &&
  infoA.parent.parent === infoB.parent.parent && // parents are siblings
  infoA.parent.value !== infoB.parent.value &&
  Math.abs(infoA.level - infoB.level) === 1
) {
  if (infoA.level < infoB.level) {
    relation = `${a} (${gender(a) === "male" ? "uncle" : "aunt"}) -> 
                ${b} (${gender(b) === "male" ? "nephew" : "niece"})`;
  } else {
    relation = `${b} (${gender(b) === "male" ? "uncle" : "aunt"}) -> 
                ${a} (${gender(a) === "male" ? "nephew" : "niece"})`;
  }
}
    setRelationMessage(relation);
    setSelectedNodes([]);
  }
}, [selectedNodes]);

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
  // 🔥 Check duplicate before inserting
  if (findNode(root, value)) {
    setMessage("Duplicates are not allowed");
    setInput("");
    return;
  }
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
  const findNodeInfo = (root, value, level = 0, parent = null, path = []) => {
  if (!root) return null;

  if (root.value === value) {
    return {
      level,
      parent,
      ancestors: [...path]
    };
  }

  if (value < root.value) {
    return findNodeInfo(
      root.left,
      value,
      level + 1,
      root,
      [...path, root]
    );
  }

  return findNodeInfo(
    root.right,
    value,
    level + 1,
    root,
    [...path, root]
  );
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
<TreeView node={root} onSelect={handleSelect} />        </div>
{relationMessage && (
  <div style={{ marginTop: "20px", fontWeight: "bold", color: "purple" }}>
    Relationship: {relationMessage}
  </div>
)}
      </div>
    </div>
  );
}
