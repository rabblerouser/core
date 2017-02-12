const AWS = require('aws-sdk');
const kinesalite = require('kinesalite');

kinesalite({ createStreamMs: 1 }).listen(4567, function(err) {
  if (err) throw err;
  console.log('Kinesalite started on port 4567!');

  const kinesis = new AWS.Kinesis({
    endpoint: 'http://localhost:4567',
    region: 'ap-southeast-2',
    accessKeyId: 'FAKE',
    secretAccessKey: 'ALSO FAKE',
  });
  kinesis.createStream({ StreamName: 'rabblerouser_stream', ShardCount: 1 }).promise().then(
    () => console.log('rabblerouser_stream created'),
    (err) => console.error('Could not create stream:', err)
  );
});
