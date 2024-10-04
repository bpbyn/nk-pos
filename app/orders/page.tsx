import Shell from '@/components/shell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';

export default function Orders() {
  return (
    <Shell>
      <div className="grid">
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="now_brewing">Now Brewing</TabsTrigger>
            <TabsTrigger value="now_serving">Now Serving</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="grid gap-2 pt-2 md:grid-cols-3 md:gap-4">
            {/* <Card className="grid gap-4 p-4 md:grid-cols-3 md:p-6"> */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">Sandara</p>
                    <p className="text-sm text-muted-foreground">SO-0001</p>
                  </div>
                  <div className="ml-auto font-medium">+$1,999.00</div>
                </div>
              </CardHeader>
              <CardContent>
                <span>White Chocolate Mocha</span>
              </CardContent>
              {/* <CardHeader className="py-4">
                <CardTitle className="flex justify-between items-center">
                  <div className='text-lg'>Joco</div>
                  <div className="text-sm font-normal text-muted-foreground">SO-007</div>
                </CardTitle>
                <CardDescription className="">
                  
                  
                </CardDescription>
              </CardHeader> */}
              {/* <CardContent> */}
              {/* <p>Card Content</p> */}

              {/* </CardContent> */}
              {/* <CardFooter>
                <p>Card Footer</p>
              </CardFooter> */}
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">Olivia Martin</p>
                    <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                  </div>
                  <div className="ml-auto font-medium">+$1,999.00</div>
                </div>
              </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="now_brewing">Brewing</TabsContent>
          <TabsContent value="now_serving">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}
