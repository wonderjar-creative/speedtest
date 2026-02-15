import type { FrontendBlock } from '@/types/coreBlockTypes';
import { stripOuterTag } from '@/utils/htmlTransformations';

interface CoreListItemBlock extends FrontendBlock {}

const ListItem: React.FC<CoreListItemBlock> = ({ innerBlocks, saveContent, dynamicContent }) => {
	const content = dynamicContent || saveContent;

	if (!content && !innerBlocks) {
		return null;
	}

	if (content) {
		const strippedContent = stripOuterTag(content, 'li');
		return <li dangerouslySetInnerHTML={{ __html: strippedContent }} />;
	}

	return <li>{innerBlocks}</li>;
};

export default ListItem;
