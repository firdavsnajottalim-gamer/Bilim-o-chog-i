export interface Fact {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'tarix' | 'anana' | 'ilm-fan' | 'qiziqarli';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
