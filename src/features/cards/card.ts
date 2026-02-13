interface Card {
  id: number,
  name: string,
  description: string,
  image: string,
  rarity: number,
  quantity: number,
}
export type CardType = Card

// Define the initial state using that type
export const initialCards: Card[] = [{
  id: 1000,
  name: "Thomas",
  description: 'Thomas, also known as "Doubting Thomas," was one of Jesus\' twelve apostles, famous for initially doubting Jesus\' resurrection until seeing Christ\'s wounds.',
  image: "/Thomas.jpg",
  rarity: 4,
  quantity: 10,
},{
  id: 1001,
  name: "Simon Peter",
  description: 'Simon Peter was one of Jesus\' twelve apostles, a key figure in early Christianity, known for his leadership and eventual martyrdom in Rome. He is considered the first pope.',
  image: "/SimonPeter.jpg",
  rarity: 5,
  quantity: 1,
},{
  id: 1002,
  name: "Andrew",
  description: 'Andrew was one of Jesus\' twelve apostles, the brother of Peter, and a fisherman by trade. He is known for spreading Christianity in Greece and Asia Minor.',
  image: "/Andrew.jpg",
  rarity: 2,
  quantity: 0,
},{
  id: 1003,
  name: "James, son of Alphaeus",
  description: 'James, son of Alphaeus, was one of the twelve apostles of Jesus. Little is known about him, and he is sometimes referred to as "James the Less."',
  image: "/JamesAlphaeus.jpg",
  rarity: 1,
  quantity: 100,
},{
  id: 1004,
  name: "Judas Iscariot",
  description: 'Judas Iscariot was one of Jesus\' twelve apostles, infamous for betraying Jesus to the authorities in exchange for thirty pieces of silver, leading to Jesus\' crucifixion.',
  image: "/JudasIscariot.jpg",
  rarity: 3,
  quantity: 0,
}];
