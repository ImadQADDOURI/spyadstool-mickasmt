// components/ExpandableText.tsx
import React, { ReactNode, useState } from "react";
import parse from "html-react-parser";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableTextProps {
  text: string;
  maxLength: number;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxLength }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const parsedText = parse(text);
  const textContent =
    typeof parsedText === "string"
      ? parsedText
      : React.Children.toArray(parsedText)
          .map((child) => {
            if (typeof child === "string") return child;
            if (
              React.isValidElement(child) &&
              typeof child.props.children === "string"
            )
              return child.props.children;
            return "";
          })
          .join(" ");

  if (textContent.length <= maxLength) {
    return <div>{parsedText}</div>;
  }

  const displayText = isExpanded
    ? text
    : textContent.slice(0, maxLength) + "...";

  return (
    <div className="mb-2 flex flex-row">
      <div>{isExpanded ? parsedText : parse(displayText)}</div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-blue-500 hover:text-blue-700"
      >
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
    </div>
  );
};

export default ExpandableText;
