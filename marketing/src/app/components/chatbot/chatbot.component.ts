import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { SharedModule } from 'src/app/modules/shared.module';
import { SkeletonComponent } from './skeleton/skeleton.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from 'src/app/services/chat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [SharedModule, SkeletonComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
})
export class ChatbotComponent {
  chatService = inject(ChatService);

  chatHistory: any[] = [];
  isLoading: boolean = false;

  constructor(){}

  ngOnInit(): void {
    initFlowbite();
    this.chatService.getMessageHistory().subscribe((res) => {
      if(res) {
        this.isLoading = true;
        this.chatHistory.push(res);
        console.log(res.message.length);
        if(res.from === 'bot' && res.message.length > 0){
          this.isLoading = false;
        }
      }
    });
  }

  prompt: string = '';

  async sendData(){
    // console.log('Prompt', this.prompt);
    if(this.prompt && !this.isLoading) {
      const data = this.prompt;
      this.prompt = '';
      await this.chatService.generateText(data);
      console.log(this.isLoading);
    } 
  }

  formatText(text: string) {
    const result = text.replaceAll('*', '');
    return result;
  }
}
