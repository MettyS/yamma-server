const usersFixture = {
  invalidPasswords: [
    'aaaaaaaaaaaaaaaaaaaaa',
    '11111111111111111',
    'aaaaaaaaaaaaa12222222',
    '!@#%$!@%#!@#$',
    '!@#$!@#$23333333333',
    '!@#E$!@#$QAWERASDF',
    'ASDFASFDasfdadsf1234',
    'ASDFasdf!@#$@!$#',
    '           ',
    '',
  ],
  nonExistingUser: {
    username: 'non-existing-user',
    email: 'a@example.com',
    password: 'N0nEx1sting',
  },
  newUser: {
    username: 'newUserName',
    email: 'new@example.com',
    plainPassword: 'P4$$word',
    hashedPassword:
      '$2a$12$YKwqtV8cQMR5Pb24.VCl6u4M65g7vaEUAgAnxbNlbu.yDPeEf9A9K',
  },
  existingUsers: [
    {
      username: 'Michael Luna',
      email: 'perezcraig@gemail.com',
      plainPassword: 'l2RdNgIC*Y',
      hashedPassword:
        '$2a$12$JETT1bQHASWMfY8TiGvcZuW8MDJOp146SsbcGKoJkyutIUPnV6ltu',
    },
    {
      username: 'John Stark',
      email: 'vholder@hotemail.com',
      plainPassword: 'Zsq+02IvBw',
      hashedPassword:
        '$2a$12$5DI9cKdjF2e6FbdUlp0Dre26Qz1.gsNWQxR1avbTmy3YLsKdJkb6m',
    },
    {
      username: 'Larry Collins',
      email: 'darrellmoore@hotemail.com',
      plainPassword: '_4gAs&x#1P',
      hashedPassword:
        '$2a$12$315pErwv5M5HZjulKCqVDe5gW0MIb39CQImgD3HBAgH6hGir7Dulu',
    },
    {
      username: 'Paul Sherman',
      email: 'ncampbell@hotemail.com',
      plainPassword: '4MWkLOyJ!p',
      hashedPassword:
        '$2a$12$X0vsQ1X1JrBrHIz1b/Toe./Oj7eAJ5Fy84re2AijtfmN5CMJUHJkC',
    },
    {
      username: 'Claire Richards',
      email: 'kelly96@yahoo.com',
      plainPassword: '_q*9s^Li$G',
      hashedPassword:
        '$2a$12$hTL.DBm1L.1jFJNa/aLet..tXlxLc2DKbS66UeJnUMekiCi8npGSq',
    },
    {
      username: 'Bruce Johnson',
      email: 'richardmann@gemail.com',
      plainPassword: '^u&Mt3&I52',
      hashedPassword:
        '$2a$12$AeMXWN/cNViJOpcrrY3h0uFDQxwpyvhQGM8.ptIfmLTrZrAwf3LJS',
    },
    {
      username: 'Julian Townsend',
      email: 'robertwright@hotemail.com',
      plainPassword: 'r*i4RLTuDu',
      hashedPassword:
        '$2a$12$q8OcLQgmWrK5eV1A2eIxFOPWaSlQFvfTYOPIwFQo/TiLYm5zml9rK',
    },
    {
      username: 'Anthony Johnson',
      email: 'lsmith@yahoo.com',
      plainPassword: 'Yn6klPW5!#',
      hashedPassword:
        '$2a$12$YtUbh/mqxvE2XikCrGfuZewMxKr8ESM1BYD9I2xAMoRbVsyTdfaXS',
    },
    {
      username: 'Michael Smith',
      email: 'andrewsharry@gemail.com',
      plainPassword: '@oUc!oFl$1',
      hashedPassword:
        '$2a$12$rT3iXgb7nJzO3Xx16CBgqe/jh7s29QHRvPllAGvGnbyWp4B9W.Nsq',
    },
    {
      username: 'Matthew Knox',
      email: 'david19@hotemail.com',
      plainPassword: '$A1lUPvOFS',
      hashedPassword:
        '$2a$12$f.oqpqUfWJf9zL10bETmQ.lzBqTrQrPqjQT0ulIl0.cK8jNR5Nyze',
    },
  ],
};

module.exports = usersFixture;
