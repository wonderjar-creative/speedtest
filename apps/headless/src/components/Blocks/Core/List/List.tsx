import type { FrontendBlock } from '@/types/coreBlockTypes';

interface CoreListBlock extends FrontendBlock {
	attributes?: {
		ordered?: boolean;
		values?: string;
	};
}

const List: React.FC<CoreListBlock> = ({ attributes, innerBlocks }) => {
	const { ordered = false } = attributes || {};
	const ListTag = ordered ? 'ol' : 'ul';
	return <ListTag>{innerBlocks}</ListTag>;
};

export default List;
