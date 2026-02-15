import { FrontendBlock } from "@/types/coreBlockTypes";
import { CoreNavigationLinkBlockAttributes } from "@/gql/graphql";
import { getBlockBaseClass } from "@/utils/blockStyles";
import Link from "next/link";

export interface CoreNavigationLinkBlock extends FrontendBlock {
  attributes?: CoreNavigationLinkBlockAttributes;
}

const NavigationLink: React.FC<CoreNavigationLinkBlock> = ({ name, attributes }) => {
  const { label, type, id, url, kind, isTopLevelLink } = attributes || {};
  const blockClasses = getBlockBaseClass(name);

  return (
    <li className={blockClasses}>
      <Link href={url || "#"}>{label || "Link"}</Link>
    </li>
  );
};

export default NavigationLink;
