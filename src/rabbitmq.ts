import amqp from 'amqplib';

const channelName = 'vendors';
let channel;

export async function connectToMQ() {
  return amqp.connect('amqp://localhost')
}

export async function createChannel(rabbitMqConnection) {
  const res = await rabbitMqConnection.createChannel();
  const queue = await res.assertQueue(channelName, { durable: false });
  channel = res;
  return res;
}

export async function receiveMessage() {
  if (channel) {
    channel.consume(channelName, function (msg) {
      const data = JSON.parse(msg.content.toString());
      // insert maney in into a vendors dump collection
    }, {
      noAck: true
    });
  } else {
    const error = 'Broker temporarily unavailable [500]';
    throw new Error(error);
  }
}


// Store woud take dtat from the queeu and perisis it in a db