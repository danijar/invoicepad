Database Structure
==================

           +-------------------------------------------+
         1 |                                           | *
    +-------------+       +-------------+       +-------------+       +-------------+
    | user        |-------| invoice     |-------| project     |-------| time        |
    +-------------+ 1   * +-------------+ ?   + +-------------+ 1   * +-------------+
    | id          |       | id          |       | id          |       | id          |
    | name        |       | user        |       | user        |       | project     |
    | mail        |       | customer    |       | invoice     |       | message     |
    | password    |       | date        |       | name        |       | start       |
    | logo        |       | consecutive |       | description |       | end         |
    +-------------+       | number      |       | deadline    |       +-------------+
     1 (*) |              | (value)     |       | value       |
           |              | pdf         |       | (hours)     |
           |              +-------------+       | agreement   |
           |                   * |              | finished    |
           |                     |              +-------------+
           |                   1 |
           |              +-------------+
           |              | customer    |
           +--------------+-------------+
                        * | id          |
                          | user        |
                          | name        |
                          | mail        |
                          | official    |
                          | address     |
                          | ustid       |
                          | notes       |
                          | logo        |
                          +-------------+
