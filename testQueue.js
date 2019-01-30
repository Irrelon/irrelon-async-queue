const AsyncQueue = require('./AsyncQueue');
const queue = new AsyncQueue({
	concurrency: 2
});

queue.worker((data) => {
	return new Promise((resolve) => {
		console.log('Worker was given data', data);
		
		setTimeout(() => {
			if (data === 3) {
				queue.push(6);
			}
			resolve();
		}, 1000);
	});
});

queue.concat([1, 2, 3, 4, 5]);

queue.start(() => {
	console.log('Queue complete');
});