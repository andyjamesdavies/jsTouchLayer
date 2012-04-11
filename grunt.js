module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		concat: {
			dist: {
				src: ['js/TouchLayerController.js', 'js/TapController.js', 'js/DragController.js', 'js/SwipeController.js', 'js/touchLayer.js'],
				dest: 'jsTouchLayer.min.js',
				separator: ';'
			}
		},
		min: {
			dist: {
				src: ['js/TouchLayerController.js', 'js/TapController.js', 'js/DragController.js', 'js/SwipeController.js', 'js/touchLayer.js'],
				dest: 'jsTouchLayer.min.js',
				separator: ';'
			}
		}
	});

	grunt.registerTask('default', 'min');

};