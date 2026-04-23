<?php
/**
 * Loader class.
 *
 * @package ElevationTheme
 * @since 0.1.0
 */

namespace ElevationTheme\Inc;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Loader class.
 *
 * Pure hook registry: collects actions/filters and registers them with
 * WordPress when run() is called. No domain logic lives here.
 */
class Loader {

	/**
	 * Registered actions.
	 *
	 * @var array
	 */
	private $actions = array();

	/**
	 * Registered filters.
	 *
	 * @var array
	 */
	private $filters = array();

	/**
	 * Queue an action for registration.
	 *
	 * @param string $hook          The WordPress action name.
	 * @param object $component     The object containing the callback.
	 * @param string $callback      The method name on the component.
	 * @param int    $priority      Hook priority.
	 * @param int    $accepted_args Number of accepted arguments.
	 * @return void
	 */
	public function add_action( string $hook, object $component, string $callback, int $priority = 10, int $accepted_args = 1 ): void {
		$this->actions[] = compact( 'hook', 'component', 'callback', 'priority', 'accepted_args' );
	}

	/**
	 * Queue a filter for registration.
	 *
	 * @param string $hook          The WordPress filter name.
	 * @param object $component     The object containing the callback.
	 * @param string $callback      The method name on the component.
	 * @param int    $priority      Hook priority.
	 * @param int    $accepted_args Number of accepted arguments.
	 * @return void
	 */
	public function add_filter( string $hook, object $component, string $callback, int $priority = 10, int $accepted_args = 1 ): void {
		$this->filters[] = compact( 'hook', 'component', 'callback', 'priority', 'accepted_args' );
	}

	/**
	 * Register all queued hooks with WordPress.
	 *
	 * @return void
	 */
	public function run(): void {
		foreach ( $this->actions as $h ) {
			add_action( $h['hook'], array( $h['component'], $h['callback'] ), $h['priority'], $h['accepted_args'] );
		}

		foreach ( $this->filters as $h ) {
			add_filter( $h['hook'], array( $h['component'], $h['callback'] ), $h['priority'], $h['accepted_args'] );
		}
	}
}
