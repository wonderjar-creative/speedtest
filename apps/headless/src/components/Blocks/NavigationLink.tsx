import Link from "next/link";
import type { FrontendBlock } from "@/types/blocks";
import { getBlockBaseClass } from "@/utils/blockStyles";

const NavigationLink: React.FC<FrontendBlock> = ({ name, attributes }) => {
  const { label, url } = attributes || {};
  const blockClasses = getBlockBaseClass(name);

  return (
    <li className={blockClasses}>
      <Link href={url || "#"}>{label || "Link"}</Link>
    </li>
  );
};

export default NavigationLink;
