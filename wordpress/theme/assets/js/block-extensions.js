/**
 * Adds a "Priority load (LCP)" toggle to the InspectorControls of
 * image-bearing blocks. The attribute itself is registered server-side
 * via BlockExtensionsFeature.php so WPGraphQL Gutenberg passes it
 * through to the headless app — this file only handles the editor UI.
 */
(function (wp) {
  if (!wp || !wp.hooks) return;

  var __ = wp.i18n.__;
  var el = wp.element.createElement;
  var Fragment = wp.element.Fragment;
  var InspectorControls = wp.blockEditor.InspectorControls;
  var PanelBody = wp.components.PanelBody;
  var ToggleControl = wp.components.ToggleControl;
  var createHigherOrderComponent = wp.compose.createHigherOrderComponent;

  var TARGET_BLOCKS = ['core/cover', 'core/image', 'core/post-featured-image'];

  // Mirror the PHP-side attribute registration so the editor knows the
  // attribute exists (otherwise it would strip `priority` on save).
  wp.hooks.addFilter(
    'blocks.registerBlockType',
    'elevation/lcp-priority-attribute',
    function (settings, name) {
      if (TARGET_BLOCKS.indexOf(name) === -1) return settings;
      settings.attributes = Object.assign({}, settings.attributes, {
        priority: { type: 'boolean', default: false },
      });
      return settings;
    }
  );

  // Add a toggle in the block sidebar.
  var withPriorityToggle = createHigherOrderComponent(function (BlockEdit) {
    return function (props) {
      if (TARGET_BLOCKS.indexOf(props.name) === -1) {
        return el(BlockEdit, props);
      }

      var priority = !!props.attributes.priority;

      return el(
        Fragment,
        {},
        el(BlockEdit, props),
        el(
          InspectorControls,
          {},
          el(
            PanelBody,
            { title: __('Performance', 'elevation'), initialOpen: false },
            el(ToggleControl, {
              label: __('Priority load (LCP)', 'elevation'),
              help: __(
                'Mark this image as the largest contentful paint candidate. ' +
                  'The headless frontend will eager-load it and inject a preload hint. ' +
                  'Set on at most one block per page.',
                'elevation'
              ),
              checked: priority,
              onChange: function (value) {
                props.setAttributes({ priority: value });
              },
            })
          )
        )
      );
    };
  }, 'withPriorityToggle');

  wp.hooks.addFilter(
    'editor.BlockEdit',
    'elevation/lcp-priority-toggle',
    withPriorityToggle
  );
})(window.wp);
