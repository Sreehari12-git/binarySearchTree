import React, {useState, useEffect, useRef} from "react";
import "./App.css";

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

const insertNode = (root, value) => {
  if(!root) return new Node(value);
  if (value === root.value) {
    return root;
  }
  if(value < root.value) {
    root.left = insertNode(root.left, value);
  } else {
    root.right = insertNode(root.right, value);
  }
  return root;
}

const findNode = (root, value) => {
  if(!root) return false;
  if(value === root.value) return true;
  if(value < root.value) return findNode(root.left, value);
  return findNode(root.right, value);
}

const deleteNode = (root, value) => {
  if(!root) return null;
  if(value < root.value) {
    root.left = deleteNode(root.left, value);
  } else if(value > root.value) {
    root.right = deleteNode(root.right,value);
  } else {
    if(!root.left) return root.right;
    if(!root.right) return root.left;
    let minNode = root.right;
    while(minNode.left) {
      minNode = minNode.left;
    }
    root.value = minNode.value;
    root.right = deleteNode(root.right, minNode.value);
  }
  return root;
}

const inOrderTraversal = (root, result =[]) => {
  if(!root) return result;
  inOrderTraversal(root.left, result)
  result.push(root.value);
  inOrderTraversal(root.right, result)
  return result;
}

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

export default function BinarySearchTreeApp() {
  const [input, setInput] = useState("");
  const [root, setRoot] = useState(null);
  const [message, setMessage] = useState("");

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
const [selectedNodes, setSelectedNodes] = useState([]);
const [relationMessage, setRelationMessage] = useState("");
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

    if (infoA.parent && infoA.parent.value === b) {
      relation = `${b} (${title.parent(b)}) -> ${a} (child)`;
    }
    else if (infoB.parent && infoB.parent.value === a) {
      relation = `${a} (${title.parent(a)}) -> ${b} (child)`;
    }

    else if (infoA.ancestors.some(n => n.value === b)) {
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

    else if (
      infoA.parent &&
      infoB.parent &&
      infoA.parent.value === infoB.parent.value
    ) {
      relation = `${a} (${title.sibling(a)}) <-> ${b} (${title.sibling(b)})`;
    }
   else if (
  infoA.parent &&
  infoB.parent &&
  infoA.parent.value !== infoB.parent.value &&
  infoA.level === infoB.level
) {
  relation = `${a} and ${b} are cousins`;
}
else if (
  infoB.parent &&
  infoA.parent &&
  infoA.parent &&
  infoB.parent &&
  infoA.parent.parent === infoB.parent.parent &&
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

  const handleInsert = () => {
    const value = parseInt(input);
    if (isNaN(value)) return;
    if (findNode(root, value)) {
      setMessage("Duplicates are not allowed");
      setInput("");
      return;
    }
    const newRoot = insertNode(root, value);
    setRoot({ ...newRoot });
    setMessage(`Inserted ${value}`);
    setInput("");
  };

  const handleDelete = () => {
    const value = parseInt(input);
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
  const handleFind = () => {
    const value = parseInt(input);
    if (isNaN(value)) return;

    const found = findNode(root, value);
    setMessage(found ? `${value} found` : `${value} not found`);
    setInput("");
  };
  const handlePrint = () => {
    const result = inOrderTraversal(root);
    setMessage(`InOrder: ${result.join(", ")}`);
  };
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
