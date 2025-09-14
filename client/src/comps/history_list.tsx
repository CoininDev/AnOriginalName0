import React, { useState } from 'react';
import { ApiResponse } from './searchbar';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface HistoryListProps {
  history: ApiResponse[];
}

const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  const [opened, setOpened] = useState<string[]>([]);
  const onOpenChange = (text: string, isOpen: boolean) => {
    if (isOpen) {
      setOpened([...opened, text])
    } else {
      setOpened(opened.filter((v) => v != text))
    }
  }

  return (
    <div className='space-y-2 mt-4'>
      {history.length === 0 ? (
        <p>:]</p>
      ) : (
        history.map((item, index) => (
  <Card key={index}>
    <Collapsible open={opened.includes(item.text)} onOpenChange={(isOpen) => onOpenChange(item.text, isOpen)}>
      <CardHeader>
        <CardTitle className='flex justify-between'>
          {item.text}
          {!opened.includes(item.text) && (
            <Badge className='text-base' variant="secondary">
              {Math.round(item.originality * 100)}%
            </Badge>
          )}
        </CardTitle>
        <CardAction>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon">
              {opened.includes(item.text) ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </CollapsibleTrigger>
        </CardAction>
      </CardHeader>
      <CardContent>
        <CollapsibleContent>
          <h4>Textos mais parecidos:</h4>
          <div className='m-4 py-2 space-y-3 border-l-2 pl-6 italic'>
            {item.most_similar.map((sim, i) => (
              <blockquote key={i}>
                "{sim.Text}" <Badge variant="secondary">{sim.Distance} de distância</Badge>
              </blockquote>
            ))}
          </div>
          <Separator className='my-4'/>
          <div className='flex space-x-4 justify-between'>
            <p>Originalidade:</p>
            <Badge className='text-base' variant="secondary">
              {Math.round(item.originality * 100)}%
            </Badge>
          </div>
        </CollapsibleContent>
      </CardContent>
    </Collapsible>
  </Card>
))
      )}
    </div>
  );
}

export default HistoryList;