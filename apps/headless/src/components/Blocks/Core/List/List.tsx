import type { FrontendBlock } from '@/types/coreBlockTypes';
import { getBlockClasses, getBlockBaseClass } from '@/utils/blockStyles';

interface CoreListBlock extends FrontendBlock {
	attributes?: {
		ordered?: boolean;
		values?: string;
		[key: string]: unknown;
	};
	saveContent?: string;
}

const List: React.FC<CoreListBlock> = ({ name, attributes, innerBlocks, saveContent }) => {
	const { ordered = false } = attributes || {};
	const ListTag = ordered ? 'ol' : 'ul';
	const classes = getBlockClasses(attributes ?? {}, getBlockBaseClass(name));

	// If we have innerBlocks (core/list-item children), render them
	if (innerBlocks && Array.isArray(innerBlocks) && innerBlocks.length > 0) {
		return <ListTag className={classes}>{innerBlocks}</ListTag>;
	}

	// Fall back to saveContent (raw HTML list items from patterns)
	if (saveContent) {
		const match = saveContent.match(/<(?:ul|ol)[^>]*>([\s\S]*)<\/(?:ul|ol)>/i);
		const inner = match ? match[1] : saveContent;
		return <ListTag className={classes} dangerouslySetInnerHTML={{ __html: inner }} />;
	}

	return <ListTag className={classes} />;
};

export default List;
