function makeEventsArray() {
    return[
        {
            id: 1,
           parent_name: 'FirstTestName' ,
            title: 'First test post!',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            address: 'fake address 1',
            time_of_event:'2020-07-15T14:45:00.000Z',
            type:'arts-crafts'

          },
          {
            id: 2,
            parent_name: 'SecondTestName',
            title: 'Second test post!',
            description: 'Lorem ipsum dolor sit amedignissimos est perspiciatis, nobis commodi alias saepe atque fac debitis rerum.',
            address: 'test address 2',
            time_of_event:'2019-05-15T14:45:00.000Z',
            type:'tutoring'
          },
          {
            id: 3,
            parent_name:'ThirdTestName',
            title: 'Third test post!',
            description: 'Lorem ipsum dolor sit amet, conid quaerat.',
            address: 'test address 3',
            time_of_event: '2010-06-15T14:45:00.000Z',
            type: 'outdoor-activities'
          },
          {
            id: 4,
            parent_name:'FourthTestName',
            title: 'Fourth test post!',
            address: 'test address 4',
            description: 'Lorem ipsum dolor sit amet consectetur adipisius veniam consectetur tempora, corporis obcaectenetur, uam?',
            time_of_event: '2020-04-15T14:45:00.000Z',
            type: 'music-dance',
          }
    ]
}
module.exports={
    makeEventsArray,
}